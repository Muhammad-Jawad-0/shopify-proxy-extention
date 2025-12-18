import FaqModel from "../models/faq.js"

export const postQuestionController = async (req, res) => {
    try {
        const { question, answer } = req.body;

        console.log("received data", question, answer)

        if (!question || !answer) {
            return res.status(400).json({ status: 400, message: "BAD REQUEST" })
        }

        const existingFaq = await FaqModel.findOne({ question });

        if (existingFaq) {
            return res.status(400).json({ status: 400, message: "Question already exists" })
        }

        const newFaq = new FaqModel({
            question,
            answer
        })

        await newFaq.save();

        return res.status(200).json({ status: 200, message: "Success", data: newFaq })

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" })
    }
}
export const getQuestionController = async (req, res) => {
    try {

        const allFaq = await FaqModel.find({});

        if (!allFaq) {
            return res.status(400).json({ status: 400, message: "Question Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Success", data: allFaq })

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" })
    }
}