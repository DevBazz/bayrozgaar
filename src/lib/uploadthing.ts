import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "#/lib/auth";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export interface UploadFileResult {
	url: string;
	name: string;
	size: number;
	key: string;
}

/**
 * Server function to upload a file directly to UploadThing
 * The file data is sent as a base64-encoded string in the request body
 */
export const uploadToUploadThingFn = createServerFn({ method: "POST" })
	.inputValidator((data: { fileName: string; fileData: string; fileSize: number }) => data)
	.handler(async ({ data }) => {
		await requireAuth();
		
		try {
			// Convert base64 to ArrayBuffer
			const base64Data = data.fileData.split(',')[1] || data.fileData;
			const buffer = Buffer.from(base64Data, 'base64');
			
			// Create a File-like object for UploadThing
			const file = new File([buffer], data.fileName, { type: 'application/pdf' });
			
			// Upload to UploadThing using UTApi
			const result = await utapi.uploadFiles(file);
			
			if (!result.data) {
				throw new Error("Upload failed - no data returned");
			}
			
			// The result.data is an UploadedFileData object
			const uploadedFile = result.data as unknown as {
				url: string;
				name: string;
				size: number;
				key: string;
				ufsUrl?: string;
			};
			
			return {
				url: uploadedFile.ufsUrl || uploadedFile.url,
				name: uploadedFile.name || data.fileName,
				size: uploadedFile.size || data.fileSize,
				key: uploadedFile.key,
			} as UploadFileResult;
		} catch (error) {
			console.error("UploadThing upload error:", error);
			throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : String(error)}`);
		}
	});

/**
 * Server function to get the public URL for an uploaded file by key
 */
export const getFileUrlFn = createServerFn({ method: "POST" })
	.inputValidator((data: { key: string }) => data)
	.handler(async ({ data }) => {
		await requireAuth();
		
		try {
			// Construct the UploadThing URL from the key
			// UploadThing URLs follow the pattern: https://utfs.io/f/{key}
			const url = `https://utfs.io/f/${encodeURIComponent(data.key)}`;
			
			return { url };
		} catch (error) {
			console.error("Failed to get file URL:", error);
			throw new Error("Failed to get file URL");
		}
	});