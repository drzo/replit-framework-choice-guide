interface ProjectTemplate {
  name: string;
  description: string;
  projectType: string;
  requirements: {
    performance: boolean;
    scalability: boolean;
    easeOfUse: boolean;
    ecosystem: boolean;
  };
  features: string[];
  boilerplatePrompt: string;
}

export const projectTemplates: ProjectTemplate[] = [
  {
    name: "REST API Service",
    description: "A RESTful API service with database integration",
    projectType: "api",
    requirements: {
      performance: true,
      scalability: true,
      easeOfUse: true,
      ecosystem: true
    },
    features: [
      "CRUD operations",
      "Database integration",
      "Authentication",
      "API documentation"
    ],
    boilerplatePrompt: "Create a REST API with the following features:\n- CRUD operations\n- Database integration\n- JWT authentication\n- API documentation using Swagger/OpenAPI"
  },
  {
    name: "SPA Dashboard",
    description: "Single Page Application dashboard with real-time updates",
    projectType: "web",
    requirements: {
      performance: true,
      scalability: false,
      easeOfUse: true,
      ecosystem: true
    },
    features: [
      "Real-time data updates",
      "Interactive charts",
      "Responsive design",
      "Theme customization"
    ],
    boilerplatePrompt: "Create a dashboard SPA with:\n- Real-time data visualization\n- Interactive charts using Recharts\n- Responsive layout\n- Dark/light theme support"
  },
  {
    name: "CLI Tool",
    description: "Command-line interface tool with file processing capabilities",
    projectType: "cli",
    requirements: {
      performance: true,
      scalability: false,
      easeOfUse: true,
      ecosystem: false
    },
    features: [
      "Command-line arguments",
      "File processing",
      "Progress indicators",
      "Error handling"
    ],
    boilerplatePrompt: "Create a CLI tool that:\n- Processes command-line arguments\n- Handles file operations\n- Shows progress bars\n- Implements proper error handling"
  },
  {
    name: "Mobile App",
    description: "Cross-platform mobile application with offline support",
    projectType: "mobile",
    requirements: {
      performance: true,
      scalability: false,
      easeOfUse: true,
      ecosystem: true
    },
    features: [
      "Cross-platform compatibility",
      "Offline data storage",
      "Push notifications",
      "Native device features"
    ],
    boilerplatePrompt: "Create a mobile app with:\n- Cross-platform support\n- Local data storage\n- Push notification handling\n- Device feature integration"
  }
];

export function findTemplatesByType(projectType: string): ProjectTemplate[] {
  return projectTemplates.filter(template => template.projectType === projectType);
}

export function getTemplateBoilerplate(templateName: string): string | undefined {
  const template = projectTemplates.find(t => t.name === templateName);
  return template?.boilerplatePrompt;
}
