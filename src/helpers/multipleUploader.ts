// external imports
import multer from 'multer';
import path from 'path';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import { Request } from 'express';

const uploader = (
  subfolder_path: string,
  allowed_file_types: string[],
  max_file_size: number,
  max_number_of_files: number,
  error_msg: string
) => {
  // File upload folder
  const UPLOADS_FOLDER = path.join(
    process.cwd(),
    `public/uploads/${subfolder_path}`
  );

  // define the storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now();

      cb(null, fileName + fileExt);
    },
  });

  // prepare the final multer upload object
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req: Request, file, cb) => {
      if ((req.files?.length as number) > max_number_of_files) {
        cb(
          new ApiError(
            httpStatus.BAD_REQUEST,
            `Maximum ${max_number_of_files} files are allowed to upload!`
          )
        );
      } else {
        if (allowed_file_types.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new ApiError(httpStatus.BAD_REQUEST, error_msg));
        }
      }
    },
  });

  return upload;
};

export const MultipleFileUploader = {
  uploader,
};
