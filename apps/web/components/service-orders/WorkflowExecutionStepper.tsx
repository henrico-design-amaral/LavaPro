import React from 'react';

interface Step {
  id: string;
  name: string;
  orderIndex: number;
}

interface WorkflowExecutionStepperProps {
  workflowName: string;
  steps: Step[];
  currentStepId?: string | null;
}

export function WorkflowExecutionStepper({ workflowName, steps, currentStepId }: WorkflowExecutionStepperProps) {
  // Find current step index to determine status of each step
  const currentIndex = steps.findIndex(s => s.id === currentStepId);
  
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm w-full">
      <h3 className="text-lg font-semibold mb-6">Workflow: {workflowName}</h3>
      
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
        
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = currentIndex > index || (currentIndex === -1 && currentStepId === null); // assuming all done if no currentStep but started
            const isCurrent = currentStepId === step.id;
            const isPending = currentIndex !== -1 && currentIndex < index;

            return (
              <div key={step.id} className="relative flex items-center gap-4 z-10">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 
                    ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : ''}
                    ${isCurrent ? 'bg-background border-primary text-primary' : ''}
                    ${isPending ? 'bg-muted border-muted-foreground text-muted-foreground' : ''}
                  `}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <div>
                  <h4 className={`font-medium ${isPending ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {step.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
