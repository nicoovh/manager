import { Meta, Story } from '@storybook/react';
import StepComponent from '../step/Step.component';
import { useStepper, TStep, TIs, TAct } from './useStepper';
import {
  OsdsButton,
  OsdsLink,
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_SELECT_SIZE,
  OdsSelectValueChangeEvent,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';

enum StepsEnum {
  FIRST_STEP = 'FIRST_STEP',
  SECOND_STEP = 'SECOND_STEP',
  THIRD_STEP = 'THIRD_STEP',
  FOURTH_STEP = 'FOURTH_STEP',
  FIFTH_STEP = 'FIFTH_STEP',
}

enum ActionsEnum {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  CHECK = 'CHECK',
  UNCHECK = 'UNCHECK',
  LOCK = 'LOCK',
  UNLOCK = 'UNLOCK',
}

type TState = {
  step?: StepsEnum;
  action?: ActionsEnum;
  logs: string[];
};

export default {
  title: 'Components/Stepper',
  component: StepComponent,
  parameters: {
    docs: {
      description: {
        component: 'This is an interactive stepper component.',
      },
    },
  },
} as Meta;

const Template: Story<any> = (args) => {
  const [state, setState] = useState<TState>({
    step: undefined,
    action: undefined,
    logs: [],
  });

  const steps: Map<StepsEnum, TStep<StepsEnum>> = new Map(
    Object.keys(StepsEnum).map((key, index) => [
      key as StepsEnum,
      {
        title: ({ stepIs }: { stepIs: TIs }) => (
          <div className="flex w-full">
            <div className="w-full">
              {index % 2 ? (
                `Title ${index + 1} as string`
              ) : (
                <h2>
                  <b>
                    <i>{`Title ${index + 1} as JSX`}</i>
                  </b>
                </h2>
              )}
            </div>
            {stepIs.locked && (
              <div className="w-3/5">
                <OsdsLink
                  className="float-left md:float-right"
                  color={ODS_THEME_COLOR_INTENT.primary}
                  onClick={() => {
                    const stepsArr = Object.keys(StepsEnum).map(
                      (s) => s as StepsEnum,
                    );
                    stepsArr.forEach((step, i) => {
                      if (i >= index) {
                        act.uncheck(step);
                        act.unlock(step);
                        if (i > index) act.close(step);
                      }
                    });
                  }}
                >
                  Edit this step
                </OsdsLink>
              </div>
            )}
          </div>
        ),
        order: index + 1,
        content: ({ stepIs, act }: { stepIs: TIs; act: TAct<StepsEnum> }) => {
          const stepsArr = Object.keys(StepsEnum).map((s) => s as StepsEnum);
          const [step, nextStep] = [
            key as StepsEnum,
            index < stepsArr.length - 1 ? stepsArr[index + 1] : undefined,
          ];

          return (
            <div>
              <div>this is content of step {key}</div>
              {index !== stepsArr.length - 1 ? (
                <div>
                  {stepIs.checked && (
                    <OsdsButton
                      color={ODS_THEME_COLOR_INTENT.info}
                      size={ODS_BUTTON_SIZE.sm}
                      inline={true}
                      className="float-right"
                      onClick={() => {
                        act.lock(step);
                        nextStep && act.open(nextStep);
                      }}
                    >
                      Next
                    </OsdsButton>
                  )}
                  <OsdsButton
                    color={ODS_THEME_COLOR_INTENT.success}
                    size={ODS_BUTTON_SIZE.sm}
                    inline={true}
                    className={clsx('float-right', stepIs.checked && 'mr-2')}
                    onClick={() => {
                      act.check(step);
                    }}
                  >
                    Validate
                  </OsdsButton>
                </div>
              ) : (
                <div>
                  <OsdsButton
                    color={ODS_THEME_COLOR_INTENT.accent}
                    size={ODS_BUTTON_SIZE.sm}
                    inline={true}
                    className="float-right"
                    onClick={() => {
                      act.check(step);
                    }}
                  >
                    Validate
                  </OsdsButton>
                </div>
              )}
              {index === stepsArr.length - 1 && stepIs.checked && (
                <div className="mt-4">
                  <OsdsMessage color={ODS_THEME_COLOR_INTENT.success}>
                    The stepper has been validated
                  </OsdsMessage>
                </div>
              )}
            </div>
          );
        },
        is: {
          open: key === StepsEnum.FIRST_STEP,
        },
      },
    ]),
  );

  const {
    Component: Stepper,
    act,
    is,
  } = useStepper({
    steps,
    on: {
      open: (step: StepsEnum) => {
        setState((prev) => ({
          ...prev,
          logs: [...prev.logs, `Step __${step}__ open`],
        }));
      },
      close: (step: StepsEnum) => {
        setState((prev) => ({
          ...prev,
          logs: [...prev.logs, `Step __${step}__ close`],
        }));
      },
      check: (step: StepsEnum) => {
        setState((prev) => ({
          ...prev,
          logs: [...prev.logs, `Step __${step}__ check`],
        }));
      },
      uncheck: (step: StepsEnum) => {
        setState((prev) => ({
          ...prev,
          logs: [...prev.logs, `Step __${step}__ uncheck`],
        }));
      },
      lock: (step: StepsEnum) => {
        setState((prev) => ({
          ...prev,
          logs: [...prev.logs, `Step __${step}__ lock`],
        }));
      },
      unlock: (step: StepsEnum) => {
        setState((prev) => ({
          ...prev,
          logs: [...prev.logs, `Step __${step}__ unlock`],
        }));
      },
    },
  });

  const Do = () => {
    const funcs = new Map([
      [ActionsEnum.OPEN, act.open],
      [ActionsEnum.CLOSE, act.close],
      [ActionsEnum.CHECK, act.check],
      [ActionsEnum.UNCHECK, act.uncheck],
      [ActionsEnum.LOCK, act.lock],
      [ActionsEnum.UNLOCK, act.unlock],
    ]);

    if (funcs.has(state.action)) {
      funcs.get(state.action)(state.step);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <OsdsSelect
            value={state.step}
            onOdsValueChange={(e: OdsSelectValueChangeEvent) =>
              setState((prev) => ({
                ...prev,
                step: e?.detail.value as StepsEnum,
              }))
            }
            size={ODS_SELECT_SIZE.md}
          >
            <span slot="placeholder">Select a step</span>
            {Object.keys(StepsEnum)?.map((key) => (
              <OsdsSelectOption key={key} value={StepsEnum[key] as StepsEnum}>
                {StepsEnum[key]}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </div>
        <div>
          <OsdsSelect
            value={state.action}
            onOdsValueChange={(e: OdsSelectValueChangeEvent) =>
              setState((prev) => ({
                ...prev,
                action: e?.detail.value as ActionsEnum,
              }))
            }
            size={ODS_SELECT_SIZE.md}
          >
            <span slot="placeholder">Select an action</span>
            {Object.keys(ActionsEnum)?.map((key) => (
              <OsdsSelectOption
                key={key}
                value={ActionsEnum[key] as ActionsEnum}
              >
                {ActionsEnum[key]}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </div>
        <div>
          <OsdsButton
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            onClick={() => Do()}
          >
            Act
          </OsdsButton>
        </div>
      </div>
      <Stepper />
      <fieldset className="border rounded p-2">
        <legend>Logs:</legend>
        <ul>
          {state.logs.map((log) => (
            <li key={uuidv4()}>{log}</li>
          ))}
        </ul>
      </fieldset>
    </div>
  );
};

export const Demo = Template.bind({});

Demo.args = {};
