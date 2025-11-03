import { Injectable } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class StorageService {
  private s3: S3;
  private endpoint: string;
  private accessKeyId: string;
  private secretAccessKey: string;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get('MINIO_ENDPOINT')!;
    this.accessKeyId = this.configService.get('MINIO_ACCESS_KEY')!;
    this.secretAccessKey = this.configService.get('MINIO_SECRET_KEY')!;
    this.bucketName = this.configService.get('MINIO_BUCKET')!;
    this.s3 = new S3({
      region: 'ru-1',
      endpoint: this.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  async deleteFile(fileName: string): Promise<void> {
    if (fileName.startsWith(`${this.endpoint}/${this.bucketName}/`)) {
      const fileKeyEncoded = fileName.replace(
        `${this.endpoint}/${this.bucketName}/`,
        '',
      );
      const fileKey = decodeURIComponent(fileKeyEncoded);
      await this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: fileKey,
      });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; name: string; key: string }> {
    const fileStream = Readable.from(file.buffer);
    // Browsers often send non-ASCII filename in latin1 via `filename=` header; recode to UTF-8
    const originalNameUtf8 = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    const originalName = originalNameUtf8.normalize('NFC');
    const fileName = `${Date.now()}-${originalName}`;
    const asciiFallback = originalName.replace(/[^\x20-\x7E]/g, '_');
    const contentDisposition = `inline; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(originalName)}`;

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileStream,
        ContentType: file.mimetype,
        ContentDisposition: contentDisposition,
      },
    });

    await upload.done();
    const encodedKey = encodeURIComponent(fileName);
    return {
      url: `${this.endpoint}/${this.bucketName}/${encodedKey}`,
      name: originalName,
      key: fileName,
    };
  }

  async getFile(key: string): Promise<Readable> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    const { Body } = await this.s3.getObject(params);
    return Body as Readable;
  }
}
