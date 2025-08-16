import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/users");
  },
  filename: (req, file, cb) => {
    const splittedFile = file.originalname.split(".");
    const fileExt = splittedFile[splittedFile.length - 1];
    const fileName = splittedFile[0].concat("-", Date.now(), ".", fileExt);
    cb(null, fileName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 1000000,
  },
});

export { multer, storage, upload };
