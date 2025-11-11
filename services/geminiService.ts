import { GoogleGenAI, Type } from '@google/genai';

// Define the shape of the raw response from the API for better type safety
interface RawScheduleTask {
  day: string;
  title: string;
  description: string;
}

export interface RawSchedulePart {
  partTitle: string;
  duration: string;
  learningMethod: string;
  tasks: RawScheduleTask[];
  practiceProblems: string[];
}


// The user's API key is automatically injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const taskSchema = {
    type: Type.OBJECT,
    properties: {
        day: { type: Type.STRING, description: 'Specific day for the task, e.g., "Day 1".' },
        title: { type: Type.STRING, description: 'A concise title for the daily task.' },
        description: { type: Type.STRING, description: 'A brief, one-sentence description of the task.' },
    },
    required: ['day', 'title', 'description'],
};

const schedulePartSchema = {
    type: Type.OBJECT,
    properties: {
        partTitle: { type: Type.STRING, description: 'Title for this part of the learning plan, e.g., "Part 1: Core Concepts".' },
        duration: { type: Type.STRING, description: 'The range of days this part covers, e.g., "Day 1 - Day 7".' },
        learningMethod: { type: Type.STRING, description: 'A paragraph describing effective learning methods for this part.' },
        tasks: {
            type: Type.ARRAY,
            description: 'A list of daily tasks for this part.',
            items: taskSchema,
        },
        practiceProblems: {
            type: Type.ARRAY,
            description: 'A list of practice problems to test understanding of this part.',
            items: { type: Type.STRING },
        },
    },
    required: ['partTitle', 'duration', 'learningMethod', 'tasks', 'practiceProblems'],
};

const scheduleSchema = {
    type: Type.ARRAY,
    description: "The entire 30-day learning plan, broken down into several parts.",
    items: schedulePartSchema,
};


export const generateSchedule = async (goal: string): Promise<RawSchedulePart[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert learning planner. Create a detailed 30-day learning schedule for the following goal: "${goal}".
Break the schedule into several logical parts (e.g., Part 1, Part 2, etc.).
For each part, provide:
1. A title for the part.
2. The duration it covers (e.g., "Day 1-7").
3. A recommended effective learning method for the topics in this part.
4. A list of daily actionable tasks within that part.
5. A set of practice problems to confirm understanding of the material covered in the part.
The overall plan should be realistic and well-paced.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: scheduleSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedSchedule = JSON.parse(jsonText);

    if (!Array.isArray(parsedSchedule)) {
      console.error('AI response was not an array:', parsedSchedule);
      throw new Error('AI response is not in the expected array format.');
    }
    
    // Basic validation to ensure the response structure is correct
    const isValid = parsedSchedule.every(part =>
      part.partTitle && part.duration && part.learningMethod && Array.isArray(part.tasks) && Array.isArray(part.practiceProblems)
    );

    if (!isValid) {
        throw new Error('AI response is missing required fields.');
    }

    return parsedSchedule;

  } catch (error) {
    console.error('Error generating schedule with Gemini:', error);
    throw new Error('Failed to generate schedule. The AI may be busy or the request could not be processed. Please try again.');
  }
};
