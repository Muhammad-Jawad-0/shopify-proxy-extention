import { Router } from "express"
import { getQuestionController, postQuestionController } from "../controller/faq.controller.js";

export const Faq = Router();

Faq.post("/question-post" , postQuestionController);
Faq.get("/question-get" , getQuestionController);