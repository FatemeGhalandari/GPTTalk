import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express(); //initialize express application

app.use(cors()); //allow server to be called from frontend
app.use(express.json()); //pass json from frontend to the backend

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello World",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt; //passing body from frontend
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",
      prompt: `${prompt}`,
      temperature: 0, //higher temperature more risks
      max_tokens: 3000, //max tokens to generate
      top_p: 1,
      frequency_penalty: 0.5, //higher frequency penalty less repetition
      presence_penalty: 0, //higher presence penalty less repetition
    });
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something went wrong",
    });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port http://localhost:5000");
});
