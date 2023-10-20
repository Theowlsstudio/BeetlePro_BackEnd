import express from 'express';
import { uploadDriverFiles, uploadMultipleFiles, upload } from '../controllers/uploads/Upload.js';
import useCheckCustomerEmail from '../middlewares/customers/useCheckExistingEmail.js';
import VerifyCustomerToken from '../middlewares/customers/verifyToken.js';
import CustomerSignIn from '../controllers/auth/customers/sign_in.js';
import CustomerSignUp from '../controllers/auth/customers/sign_up.js';
import apiGuardDrivers from '../middlewares/drivers/apiGuard.js';
import useCheckDriverEmail from '../middlewares/drivers/useCheckExistingEmail.js';
import VerifyDriverToken from '../middlewares/drivers/verifyToken.js';
import DriverSignIn from '../controllers/auth/drivers/sign_in.js';
import DriverSignUp from '../controllers/auth/drivers/sign_up.js';
import DriverSignUpOnboard from '../controllers/auth/drivers/sign_up_test.js';

import { OnboardingV1, OnboardingV2, OnboardingV3 } from '../controllers/auth/drivers/onboarding.js';
import dynamicFieldName from '../middlewares/setFileName.js';
import config from '../../config.js';
import apiGuard from '../middlewares/customers/apiGuard.js';
import getUserData from '../controllers/auth/getUserData.js';
import updateUserProfile from '../controllers/auth/customers/updateProfile.js';
import generateEmailOtp from '../controllers/auth/customers/generateEmailOtp.js';
import verifyEmailOtp from '../controllers/auth/customers/verifyEmailOtp.js';
import resetPassword from '../controllers/auth/customers/resetPassword.js';
import generateEmailOtpDrivers from '../controllers/auth/drivers/generateEmailOtp.js';
import verifyEmailOtpDrivers from '../controllers/auth/drivers/verifyEmailOtp.js';
import resetPasswordDrivers from '../controllers/auth/drivers/resetPassword.js';
import getChat from '../controllers/auth/customers/getChat.js';

let { usersCollection, driversCollection } = config;

const router = express.Router();


// driver auth 
router.get('/driver/:user_id', getUserData(driversCollection));
router.post('/driver/sign_up', uploadMultipleFiles, useCheckDriverEmail, DriverSignUpOnboard);
router.post('/driver/register', uploadMultipleFiles, useCheckDriverEmail, DriverSignUp);
router.post('/driver/login', VerifyDriverToken, DriverSignIn);
router.post('/driver/generate-email-otp', generateEmailOtpDrivers);
router.post('/driver/verify-email-otp', verifyEmailOtpDrivers);
router.post('/driver/reset-password', resetPasswordDrivers);

// driver file uploads 
router.post('/driver/onboarding/v1', apiGuardDrivers, uploadMultipleFiles, OnboardingV1);
router.post('/driver/onboarding/v2', apiGuardDrivers, uploadDriverFiles, OnboardingV2);
router.post('/driver/onboarding/v3', apiGuardDrivers, dynamicFieldName, OnboardingV3);

// customer auth
router.get('/customer/:user_id', getUserData(usersCollection));
router.post('/customer/register', useCheckCustomerEmail, CustomerSignUp);
router.post('/customer/login', VerifyCustomerToken, CustomerSignIn);
router.post('/customer/update-profile', apiGuard, upload.single('image'), updateUserProfile);


router.post('/customer/generate-email-otp', generateEmailOtp);
router.post('/customer/verify-email-otp', verifyEmailOtp);
router.post('/customer/reset-password', resetPassword);


router.get('/get-customer-chat/:driver_id', apiGuard, getChat);


export default router;