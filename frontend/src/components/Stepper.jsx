import { Stepper as MantineStepper, Group, Button } from "@mantine/core";
import {
  IconUser,
  IconHome,
  IconSchool,
  IconBriefcase,
  IconTools,
  IconHeartHandshake,
  IconHealthRecognition,
  IconShieldCheck,
  IconEye,
} from "@tabler/icons-react";

const icons = {
  personal: IconUser,
  contact: IconHome,
  academic: IconSchool,
  experience: IconBriefcase,
  skills: IconTools,
  committees: IconHeartHandshake,
  health: IconHealthRecognition,
  consent: IconShieldCheck,
  preview: IconEye,
};

function Stepper({ active, onStepChange, onNext, onPrev, steps }) {
  return (
    <>
      <MantineStepper
        active={active}
        onStepClick={onStepChange}
        allowNextStepsSelect={false}
        iconSize={32}
        mb="xl"
      >
        {steps.map((step, index) => {
          const Icon = icons[step.key];
          return (
            <MantineStepper.Step
              key={step.key}
              label={step.title}
              description={step.description}
              icon={Icon && <Icon size={18} />}
            />
          );
        })}
      </MantineStepper>

      <Group justify="center" mt="xl">
        {active > 0 && <Button onClick={onPrev}>Previous</Button>}
        {active < steps.length - 1 && (
          <Button onClick={onNext}>Next Step</Button>
        )}
      </Group>
    </>
  );
}

export default Stepper;
