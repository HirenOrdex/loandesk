import { PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { s3Config } from "../configs/s3Config";
import { AWS_REGION, AWS_S3_BUCKET_NAME } from "../configs/envConfigs";
import { lookup as getMimeType } from "mime-types";
import { logger } from "../configs/winstonConfig";

export async function uploadFileToS3(
    fileName: string,
    fileContent: Buffer,
    folderName: string,
): Promise<PutObjectCommandOutput & { Location: string }> {
    const buffer: Buffer = fileContent;
    folderName = folderName.endsWith('/') ? folderName : folderName + '/';
    const key: string = `${folderName}${fileName}`;
    const mimeType: string = getMimeType(fileName) || "application/octet-stream";

    console.log(`Uploading file to S3... - Bucket: ${AWS_S3_BUCKET_NAME} - Key: ${key} - MIME Type: ${mimeType}`);
    logger.info(`Uploading file to S3... - Bucket: ${AWS_S3_BUCKET_NAME} - Key: ${key} - MIME Type: ${mimeType}`);

    const commandInput: PutObjectCommandInput = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
    };

    const command: PutObjectCommand = new PutObjectCommand(commandInput);

    try {
        const result: PutObjectCommandOutput = await s3Config.send(command);
        const location: string = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
        console.log(`File uploaded successfully: ${location}`);
        logger.info(`File uploaded successfully: ${location}`);

        return {
            ...result,
            Location: location,
        };
    } catch (error: unknown) {
        console.error("S3 Upload Error:", error);
        logger.error("S3 Upload Error:", error);
        throw error;
    }
}
