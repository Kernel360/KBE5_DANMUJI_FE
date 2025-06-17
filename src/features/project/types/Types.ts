export type PostPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export const POST_PRIORITY_OPTIONS: PostPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
export const POST_PRIORITY_LABELS: Record<PostPriority, string> = {
    LOW: '낮음',
    MEDIUM: '보통',
    HIGH: '높음',
    URGENT: '긴급',
};

export type PostType = 'GENERAL' | 'QUESTION';

export interface Post {
    id: number;
    step: string;
    title: string;
    writer: string;
    priority: PostPriority;
    type: PostType;
    createdAt: string;
}

export interface Project {
    id: number;
    name: string;
    client: string;
    clientManager: string;
    devManagers: string;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
    priority: '긴급' | '높음' | '보통' | '낮음';
    startDate: string;
    endDate: string;
}

export interface ProjectStep {
    id: number;
    stepOrder: number;
    name: string;
    projectStepStatus: string;
    projectFeedbackStepStatus: string | null;
    isDeleted: boolean;
    user: any;
}

export type Step = string;
export type StepList = Step[];

export interface ProjectDetailResponse {
    status: string;
    code: string;
    message: string;
    data: {
        id: number;
        name: string;
        steps: ProjectStep[];
    };
}