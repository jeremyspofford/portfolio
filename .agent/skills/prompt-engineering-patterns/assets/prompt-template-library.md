# Prompt Template Library

## Classification Templates

### Sentiment Analysis

```markdown
Classify the sentiment of the following text as Positive, Negative, or Neutral.

Text: {text}

Sentiment:
```markdown

### Intent Detection

```markdown
Determine the user's intent from the following message.

Possible intents: {intent_list}

Message: {message}

Intent:
```markdown

### Topic Classification

```markdown
Classify the following article into one of these categories: {categories}

Article:
{article}

Category:
```markdown

## Extraction Templates

### Named Entity Recognition

```markdown
Extract all named entities from the text and categorize them.

Text: {text}

Entities (JSON format):
{
  "persons": [],
  "organizations": [],
  "locations": [],
  "dates": []
}
```markdown

### Structured Data Extraction

```markdown
Extract structured information from the job posting.

Job Posting:
{posting}

Extracted Information (JSON):
{
  "title": "",
  "company": "",
  "location": "",
  "salary_range": "",
  "requirements": [],
  "responsibilities": []
}
```markdown

## Generation Templates

### Email Generation

```markdown
Write a professional {email_type} email.

To: {recipient}
Context: {context}
Key points to include:
{key_points}

Email:
Subject:
Body:
```markdown

### Code Generation

```markdown
Generate {language} code for the following task:

Task: {task_description}

Requirements:
{requirements}

Include:
- Error handling
- Input validation
- Inline comments

Code:
```markdown

### Creative Writing

```markdown
Write a {length}-word {style} story about {topic}.

Include these elements:
- {element_1}
- {element_2}
- {element_3}

Story:
```markdown

## Transformation Templates

### Summarization

```markdown
Summarize the following text in {num_sentences} sentences.

Text:
{text}

Summary:
```markdown

### Translation with Context

```markdown
Translate the following {source_lang} text to {target_lang}.

Context: {context}
Tone: {tone}

Text: {text}

Translation:
```markdown

### Format Conversion

```markdown
Convert the following {source_format} to {target_format}.

Input:
{input_data}

Output ({target_format}):
```markdown

## Analysis Templates

### Code Review

```markdown
Review the following code for:
1. Bugs and errors
2. Performance issues
3. Security vulnerabilities
4. Best practice violations

Code:
{code}

Review:
```markdown

### SWOT Analysis

```markdown
Conduct a SWOT analysis for: {subject}

Context: {context}

Analysis:
Strengths:
-

Weaknesses:
-

Opportunities:
-

Threats:
-
```markdown

## Question Answering Templates

### RAG Template

```markdown
Answer the question based on the provided context. If the context doesn't contain enough information, say so.

Context:
{context}

Question: {question}

Answer:
```markdown

### Multi-Turn Q&A

```markdown
Previous conversation:
{conversation_history}

New question: {question}

Answer (continue naturally from conversation):
```markdown

## Specialized Templates

### SQL Query Generation

```markdown
Generate a SQL query for the following request.

Database schema:
{schema}

Request: {request}

SQL Query:
```markdown

### Regex Pattern Creation

```markdown
Create a regex pattern to match: {requirement}

Test cases that should match:
{positive_examples}

Test cases that should NOT match:
{negative_examples}

Regex pattern:
```markdown

### API Documentation

```markdown
Generate API documentation for this function:

Code:
{function_code}

Documentation (follow {doc_format} format):
```markdown

## Use these templates by filling in the {variables}
