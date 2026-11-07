import mongoose from 'mongoose';

// Technical question schema
const technicalQuestionSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: [true, "Question is required"] 
  },
  intention: { 
    type: String, 
    required: [true, "Intention is required"] 
  },
  answer: { 
    type: String, 
    required: [true, "Answer is required"] 
  }
}, { _id: false });

// Behavioral question schema
const behavioralQuestionSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: [true, "Question is required"] 
  },
  intention: { 
    type: String, 
    required: [true, "Intention is required"] 
  },
  answer: { 
    type: String, 
    required: [true, "Answer is required"] 
  }
}, { _id: false });

// Skill gaps schema
const skillGapSchema = new mongoose.Schema({
  skill: { 
    type: String, 
    required: [true, "Skill is required"] 
  },
  severity: { 
    type: String, 
    required: [true, "Severity is required"], 
    enum: ['low', 'medium', 'high'] // Fixed: Added quotes here
  }
}, { _id: false });

// Preparation plan schema
const preparationPlanSchema = new mongoose.Schema({
  day: { 
    type: Number, 
    required: [true, "Day is required"] 
  },
  focus: { 
    type: String, 
    required: [true, "Focus is required"] 
  },
  tasks: [{ 
    type: String, 
    required: [true, "Task is required"] 
  }]
}, { _id: false }); // Added _id:false to keep consistent with others

/////////////////////////////////////////////

const reportSchema = new mongoose.Schema({
  jobdescription: { 
    type: String, 
    required: [true, "Job description is required"] 
  },
  resume: { 
    type: String 
  },
  selfdescription: { 
    type: String 
  },
  matchScore: { 
    type: Number, 
    min: 0, 
    max: 100 
  },
  technicalQuestions: [technicalQuestionSchema],  // Fixed: Typo in field name
  behavioralQuestions: [behavioralQuestionSchema], // Fixed: Typo & pluralized
  skillGaps: [skillGapSchema],                    // Fixed: Capitalization consistency
  preparationPlan: [preparationPlanSchema]        // Fixed: Mapped schema correctly
}, { timestamps: true });

const interviewReportModel = mongoose.model("InterviewReport", reportSchema);

export default interviewReportModel;
