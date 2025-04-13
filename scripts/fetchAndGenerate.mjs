import Parser from "rss-parser";
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { OpenAI } from "openai";
import matter from "gray-matter";
import fetch from "node-fetch";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const parser = new Parser();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchRSSAndGenerate() {
  try {
    // Step 1: Fetch RSS Feed
    const feed = await parser.parseURL("https://static.cricinfo.com/rss/livescores.xml");
    const firstItem = feed.items[0];

    const title = firstItem.title;
    const summary = firstItem.contentSnippet || firstItem.content || "";
    const url = firstItem.link;

    // Step 2: Generate AI Blog Post
    const aiPrompt = `
You are a professional blogger and SEO expert. Rewrite the following blog post with a unique tone, add subheadings, improve flow, and make it SEO-friendly. Ensure it's at least 900 words.

Title: ${title}
Summary: ${summary}
Link: ${url}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: aiPrompt }],
    });

    const aiContent = completion.choices[0].message.content;

    // Step 3: Generate AI Image
    const imagePrompt = `Create a high-quality blog cover image representing: "${title}". Style: clean, modern, SEO-optimized.`;
    const imageGen = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1024x1024", // closest size supported
      quality: "standard",
      n: 1,
    });

    const imageUrl = imageGen.data[0].url;

    // Step 4: Save Image Locally
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const imagePath = `content/images/${slug}.png`;
    const imageFullPath = path.join(__dirname, `../${imagePath}`);

    const res = await fetch(imageUrl);
    const buffer = await res.buffer();
    await fse.outputFile(imageFullPath, buffer);

    // Step 5: Save Markdown File
    const date = new Date().toISOString();
    const frontmatter = matter.stringify(aiContent, {
      title,
      date,
      slug,
      original_url: url,
      image: `/${imagePath}`, // For use in frontend
    });

    const postPath = path.join(__dirname, `../content/posts/${slug}.md`);
    fs.writeFileSync(postPath, frontmatter);

    console.log(`✅ Blog post saved: ${slug}.md`);
    console.log(`🖼️ Image saved locally: ${imagePath}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

fetchRSSAndGenerate();
