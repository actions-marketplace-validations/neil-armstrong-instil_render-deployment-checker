export interface Deployment {
  deploy: {
    id: string;
    commit?: {
      id: string;
      message: string;
      createdAt: string;
    };
    status: string;
    finishedAt: string;
    createdAt: string;
    updatedAt: string;
  };
}