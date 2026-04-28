import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as path from 'path';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {

  @Post('image')
  @ApiOperation({ summary: 'Upload ảnh dịch vụ' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const assetsDir =
            process.env.ASSETS_PNG_DIR ||
            path.resolve(process.cwd(), '..', 'DichVuSo-main', 'src', 'assets', 'png');
          cb(null, assetsDir);
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext)
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-_]/g, '');
          cb(null, `${name}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
          return cb(new BadRequestException('Chỉ chấp nhận file ảnh .png .jpg .jpeg .webp .svg'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Không có file nào được upload.');
    return {
      filename: file.filename,
      imageUrl: `/assets/png/${file.filename}`,
    };
  }
}