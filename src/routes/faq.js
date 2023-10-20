import express from 'express';
import getFaqs from '../controllers/faqs/getFaqs.js'
import saveFaqs from '../controllers/faqs/saveFaqs.js'
import getFaqById from '../controllers/faqs/getFaqById.js'
import updateFaqById from '../controllers/faqs/updateFaqById.js'


const router = express.Router();

router.get('/driver/get-faqs', getFaqs);
router.post('/driver/save-faqs', saveFaqs);
router.get('/driver/get-faq-by-id/:faq_id', getFaqById);
router.post('/driver/update-faq-by-id/:faq_id', updateFaqById);


export default router;