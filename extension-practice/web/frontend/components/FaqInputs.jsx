import React, { useEffect, useState } from 'react'
import "./FaqInputs.css"

const FaqInputs = () => {


    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [allQuestions, setAllQuestions] = useState([]);

    const questionHandler = (e) => {
        setQuestion(e.target.value);
    }
    const answerHandler = (e) => {

        setAnswer(e.target.value);
    }

    const saveHandler = async () => {

        if (!question.trim() || !answer.trim()) {
            alert("All Feild Are Required");
            return;
        }

        const data = await fetch("/api/question-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question, answer })
        })

        console.log(await data.json())

        alert("Saved Successfully")

        setQuestion("");   // ✅ clear input
        setAnswer("");     // ✅ clear input
        getQuestionHandler(); // ✅ auto refresh list
    }

    const getQuestionHandler = async () => {
        const res = await fetch("/api/question-get")
        const data = await res.json();
        setAllQuestions(data.data)
        console.log(data.data, " <<<< data")
    }

    useEffect(() => {
        getQuestionHandler();
    }, [])

    return (
        <div className='input-container'>
            <h1 className='heading'>FAQ</h1>
            <div className="inputs">
                <input type="text" value={question} placeholder='Enter Your Question' onChange={(e) => questionHandler(e)} className='input-question' />
                <input type="text" value={answer} placeholder='Enter Your Answer' onChange={(e) => answerHandler(e)} className='input-answer' />
            </div>

            <div className="save-btn" onClick={saveHandler}>
                <button>Save</button>
            </div>
            <h2 className="faq-heading">All Questions</h2>

            <button className="fetch-btn" onClick={getQuestionHandler}>
                Refresh FAQs
            </button>

            <ul className="faq-list">
                {allQuestions.map((q, i) => (
                    <li className="faq-item" key={i}>
                        <h3 className="faq-question">❓ {q.question}</h3>
                        <p className="faq-answer">{q.answer}</p>
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default FaqInputs