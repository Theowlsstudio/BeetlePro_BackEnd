import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

let fields = [
    { name: 'driver_license' },
    { name: 'driver_gray_front' },
    { name: 'driver_gray_back' },
    { name: 'driver_insurance_front' },
    { name: 'driver_insurance_back' },
    { name: 'driver_other_document' },
]

const uploadDriverFiles = upload.fields(fields);
const uploadMultipleFiles = upload.any();
const uploadSingleFile = (name) => upload.single(name);

export { upload, uploadDriverFiles, uploadMultipleFiles, uploadSingleFile };