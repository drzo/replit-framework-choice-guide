interface ProjectRequirements {
  projectName: string;
  description: string;
  projectType: string;
  requirements: {
    performance: boolean;
    scalability: boolean;
    easeOfUse: boolean;
    ecosystem: boolean;
  };
}

interface FrameworkRecommendation {
  recommendation: string;
  prompt: string;
}

const frameworks = {
  web: {
    react: {
      name: "React",
      description: "A JavaScript library for building user interfaces",
      strengths: ["ecosystem", "performance"],
    },
    vue: {
      name: "Vue.js",
      description: "The Progressive JavaScript Framework",
      strengths: ["easeOfUse", "ecosystem"],
    },
    next: {
      name: "Next.js",
      description: "The React Framework for Production",
      strengths: ["performance", "scalability"],
    },
  },
  api: {
    express: {
      name: "Express.js",
      description: "Fast, unopinionated, minimalist web framework for Node.js",
      strengths: ["ecosystem", "easeOfUse"],
    },
    fastify: {
      name: "Fastify",
      description: "Fast and low overhead web framework for Node.js",
      strengths: ["performance", "scalability"],
    },
  },
};

export function evaluateFramework(requirements: ProjectRequirements): FrameworkRecommendation {
  let recommendation: string;
  const { projectType, requirements: reqs } = requirements;

  if (projectType === "web") {
    if (reqs.performance && reqs.scalability) {
      recommendation = "Next.js is recommended for your project due to its built-in performance optimizations and scalability features. It provides server-side rendering, static site generation, and excellent developer experience.";
    } else if (reqs.easeOfUse) {
      recommendation = "Vue.js is recommended for your project. It's known for its gentle learning curve and excellent documentation, making it perfect for teams prioritizing ease of use.";
    } else {
      recommendation = "React is recommended as a versatile choice with a massive ecosystem and strong community support. It's well-suited for most web applications and has excellent tooling.";
    }
  } else if (projectType === "api") {
    if (reqs.performance) {
      recommendation = "Fastify is recommended for your API project. It's one of the fastest Node.js frameworks and has excellent TypeScript support.";
    } else {
      recommendation = "Express.js is recommended for your API project. It's the most popular Node.js framework with extensive middleware support and documentation.";
    }
  } else {
    recommendation = "Based on your requirements, we recommend starting with a simple Express.js setup which can be easily extended as needed.";
  }

  const prompt = generatePrompt(requirements, recommendation);

  return {
    recommendation,
    prompt,
  };
}

function generatePrompt(requirements: ProjectRequirements, recommendation: string): string {
  return `I'm building ${requirements.projectName}, which is ${requirements.description}

Key requirements:
${Object.entries(requirements.requirements)
  .filter(([_, value]) => value)
  .map(([key]) => `- ${key}`)
  .join('\n')}

Based on analysis: ${recommendation}

Please help me set up a project with these specifications using best practices and proper configuration for Replit.`;
}
