// Dummy data for the application

export interface DummyProject {
  id: number;
  name: string;
  manager: string;
  dueDate: string;
  status: 'completed' | 'delayed' | 'ongoing' | 'at-risk';
  progress: number;
  description: string;
}

export interface DummyTask {
  id: number;
  title: string;
  status: 'approved' | 'in-review' | 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignedTo: string;
  projectId: number;
}

export interface DummyResource {
  id: number;
  name: string;
  role: string;
  email: string;
  assignedProjects: number;
  availability: number;
  status: 'available' | 'busy' | 'on-leave';
}

export interface TimeLogEntry {
  id: number;
  projectName: string;
  taskName: string;
  hours: number;
  date: string;
  user: string;
}

export interface ProjectTemplate {
  id: number;
  name: string;
  description: string;
  tasksCount: number;
  estimatedDuration: string;
  category: string;
}

export const dummyProjects: DummyProject[] = [
  {
    id: 1,
    name: 'Nelsa web development',
    manager: 'Om prakash sao',
    dueDate: 'May 25, 2023',
    status: 'completed',
    progress: 100,
    description: 'Complete web development project for Nelsa company'
  },
  {
    id: 2,
    name: 'Datascale AI app',
    manager: 'Neilsan mando',
    dueDate: 'Jun 20, 2023',
    status: 'delayed',
    progress: 30,
    description: 'AI-powered data analytics application'
  },
  {
    id: 3,
    name: 'Media channel branding',
    manager: 'Tirunelv priya',
    dueDate: 'July 13, 2023',
    status: 'at-risk',
    progress: 68,
    description: 'Complete branding overhaul for media channel'
  },
  {
    id: 4,
    name: 'Corlax iOS app development',
    manager: 'Matte hannery',
    dueDate: 'Dec 20, 2023',
    status: 'completed',
    progress: 100,
    description: 'iOS mobile application for Corlax'
  },
  {
    id: 5,
    name: 'Website builder development',
    manager: 'Sukumar rao',
    dueDate: 'Mar 15, 2024',
    status: 'ongoing',
    progress: 50,
    description: 'Drag and drop website builder platform'
  },
  {
    id: 6,
    name: 'E-commerce Platform',
    manager: 'Sarah Johnson',
    dueDate: 'Aug 10, 2024',
    status: 'ongoing',
    progress: 75,
    description: 'Full-featured e-commerce solution'
  },
  {
    id: 7,
    name: 'Mobile Banking App',
    manager: 'David Chen',
    dueDate: 'Sep 30, 2024',
    status: 'ongoing',
    progress: 45,
    description: 'Secure mobile banking application'
  },
  {
    id: 8,
    name: 'Healthcare Portal',
    manager: 'Emily Brown',
    dueDate: 'Oct 15, 2024',
    status: 'delayed',
    progress: 25,
    description: 'Patient management and telemedicine portal'
  }
];

export const dummyTasks: DummyTask[] = [
  {
    id: 1,
    title: 'Create a user flow of social application design',
    status: 'approved',
    priority: 'high',
    dueDate: '2024-10-30',
    assignedTo: 'Om prakash sao',
    projectId: 1
  },
  {
    id: 2,
    title: 'Create a user flow of social application design',
    status: 'in-review',
    priority: 'medium',
    dueDate: '2024-10-31',
    assignedTo: 'Neilsan mando',
    projectId: 1
  },
  {
    id: 3,
    title: 'Landing page design for Fintech project of singapore',
    status: 'in-review',
    priority: 'high',
    dueDate: '2024-11-01',
    assignedTo: 'Tirunelv priya',
    projectId: 2
  },
  {
    id: 4,
    title: 'Design system documentation',
    status: 'completed',
    priority: 'medium',
    dueDate: '2024-10-28',
    assignedTo: 'Matte hannery',
    projectId: 3
  },
  {
    id: 5,
    title: 'API integration for payment gateway',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-11-05',
    assignedTo: 'Sukumar rao',
    projectId: 6
  },
  {
    id: 6,
    title: 'Database optimization',
    status: 'in-review',
    priority: 'high',
    dueDate: '2024-11-02',
    assignedTo: 'Sarah Johnson',
    projectId: 6
  },
  {
    id: 7,
    title: 'Mobile app testing',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-11-10',
    assignedTo: 'David Chen',
    projectId: 7
  },
  {
    id: 8,
    title: 'Security audit',
    status: 'approved',
    priority: 'high',
    dueDate: '2024-10-29',
    assignedTo: 'Emily Brown',
    projectId: 7
  }
];

export const dummyResources: DummyResource[] = [
  {
    id: 1,
    name: 'Om prakash sao',
    role: 'Senior Developer',
    email: 'om.sao@company.com',
    assignedProjects: 3,
    availability: 20,
    status: 'busy'
  },
  {
    id: 2,
    name: 'Neilsan mando',
    role: 'Project Manager',
    email: 'neilsan.m@company.com',
    assignedProjects: 5,
    availability: 10,
    status: 'busy'
  },
  {
    id: 3,
    name: 'Tirunelv priya',
    role: 'UI/UX Designer',
    email: 'tirunelv.p@company.com',
    assignedProjects: 2,
    availability: 50,
    status: 'available'
  },
  {
    id: 4,
    name: 'Matte hannery',
    role: 'iOS Developer',
    email: 'matte.h@company.com',
    assignedProjects: 1,
    availability: 80,
    status: 'available'
  },
  {
    id: 5,
    name: 'Sukumar rao',
    role: 'Full Stack Developer',
    email: 'sukumar.r@company.com',
    assignedProjects: 2,
    availability: 40,
    status: 'available'
  },
  {
    id: 6,
    name: 'Sarah Johnson',
    role: 'Backend Developer',
    email: 'sarah.j@company.com',
    assignedProjects: 4,
    availability: 15,
    status: 'busy'
  },
  {
    id: 7,
    name: 'David Chen',
    role: 'Mobile Developer',
    email: 'david.c@company.com',
    assignedProjects: 3,
    availability: 30,
    status: 'available'
  },
  {
    id: 8,
    name: 'Emily Brown',
    role: 'QA Engineer',
    email: 'emily.b@company.com',
    assignedProjects: 0,
    availability: 100,
    status: 'on-leave'
  }
];

export const dummyTimeLogs: TimeLogEntry[] = [
  {
    id: 1,
    projectName: 'Nelsa web development',
    taskName: 'Frontend development',
    hours: 8,
    date: '2024-10-30',
    user: 'Om prakash sao'
  },
  {
    id: 2,
    projectName: 'Datascale AI app',
    taskName: 'API integration',
    hours: 6,
    date: '2024-10-30',
    user: 'Neilsan mando'
  },
  {
    id: 3,
    projectName: 'Media channel branding',
    taskName: 'Logo design',
    hours: 4,
    date: '2024-10-29',
    user: 'Tirunelv priya'
  },
  {
    id: 4,
    projectName: 'Corlax iOS app development',
    taskName: 'Bug fixing',
    hours: 5,
    date: '2024-10-29',
    user: 'Matte hannery'
  },
  {
    id: 5,
    projectName: 'Website builder development',
    taskName: 'Component library',
    hours: 7,
    date: '2024-10-28',
    user: 'Sukumar rao'
  },
  {
    id: 6,
    projectName: 'E-commerce Platform',
    taskName: 'Payment integration',
    hours: 8,
    date: '2024-10-30',
    user: 'Sarah Johnson'
  },
  {
    id: 7,
    projectName: 'Mobile Banking App',
    taskName: 'Security implementation',
    hours: 6,
    date: '2024-10-29',
    user: 'David Chen'
  }
];

export const dummyTemplates: ProjectTemplate[] = [
  {
    id: 1,
    name: 'Web Development Project',
    description: 'Standard web development project template with common tasks',
    tasksCount: 25,
    estimatedDuration: '3 months',
    category: 'Web Development'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'Template for iOS and Android app development',
    tasksCount: 30,
    estimatedDuration: '4 months',
    category: 'Mobile Development'
  },
  {
    id: 3,
    name: 'Marketing Campaign',
    description: 'Digital marketing campaign project template',
    tasksCount: 15,
    estimatedDuration: '2 months',
    category: 'Marketing'
  },
  {
    id: 4,
    name: 'Product Launch',
    description: 'Complete product launch workflow template',
    tasksCount: 20,
    estimatedDuration: '2 months',
    category: 'Product'
  },
  {
    id: 5,
    name: 'Design System',
    description: 'Create a comprehensive design system',
    tasksCount: 18,
    estimatedDuration: '6 weeks',
    category: 'Design'
  }
];
