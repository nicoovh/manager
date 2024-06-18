import React, { useEffect, useState } from 'react';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { clsx } from 'clsx';
import { hashCode } from '../../../utils';

export type TIs = {
  open?: boolean;
  checked?: boolean;
  locked?: boolean;
};

type TOn<T> = {
  open?: (step: T) => void;
  close?: (step: T) => void;

  check?: (step: T) => void;
  uncheck?: (step: T) => void;

  lock?: (step: T) => void;
  unlock?: (step: T) => void;
};

export type TAct<T> = {
  open: (step: T) => void;
  close: (step: T) => void;

  check: (step: T) => void;
  uncheck: (step: T) => void;

  lock: (step: T) => void;
  unlock: (step: T) => void;
};

export type TStep<T> = {
  order?: number;
  title?:
    | string
    | JSX.Element
    | (({
        stepIs,
        stepperIs,
        act,
      }: {
        stepIs: TIs;
        stepperIs: Map<T, TIs>;
        act: TAct<T>;
      }) => string | JSX.Element);
  content?:
    | string
    | JSX.Element
    | JSX.Element[]
    | (({
        stepIs,
        stepperIs,
        act,
      }: {
        stepIs: TIs;
        stepperIs: Map<T, TIs>;
        act: TAct<T>;
      }) => string | JSX.Element | JSX.Element[]);
  is: TIs;
};

export const useStepper = function <T>({
  steps,
  on,
}: {
  steps: Map<T, TStep<T>>;
  on?: TOn<T>;
}) {
  const [is, setIs] = useState<Map<T, TIs>>(new Map());

  useEffect(() => {
    if (steps) {
      const nextIs = new Map(
        [...steps.keys()].map((key) => [
          key,
          {
            open: steps.get(key).is.open || false,
            checked: steps.get(key).is.checked || false,
            locked: steps.get(key).is.locked || false,
          },
        ]),
      );
      setIs(nextIs);
    }
  }, []);

  const act = {
    open: (step: T) => {
      const newIs = new Map(is);
      if (newIs.has(step) && newIs.get(step).open === false) {
        newIs.get(step).open = true;
        setIs(newIs);
        if (on && on.open) {
          on.open(step);
        }
      }
    },
    close: (step: T) => {
      const newIs = new Map(is);
      if (newIs.has(step) && newIs.get(step).open === true) {
        newIs.get(step).open = false;
        setIs(newIs);
        if (on && on.close) {
          on.close(step);
        }
      }
    },
    check: (step: T) => {
      const newIs = new Map(is);
      if (newIs.has(step) && newIs.get(step).checked === false) {
        newIs.get(step).checked = true;
        setIs(newIs);
        if (on && on.check) {
          on.check(step);
        }
      }
    },
    uncheck: (step: T) => {
      const newIs = new Map(is);
      if (newIs.has(step) && newIs.get(step).checked === true) {
        newIs.get(step).checked = false;
        setIs(newIs);
        if (on && on.uncheck) {
          on.uncheck(step);
        }
      }
    },

    lock: (step: T) => {
      const newIs = new Map(is);
      if (newIs.has(step) && newIs.get(step).locked === false) {
        newIs.get(step).locked = true;
        setIs(newIs);
        if (on && on.lock) {
          on.lock(step);
        }
      }
    },
    unlock: (step: T) => {
      const newIs = new Map(is);
      if (newIs.has(step) && newIs.get(step).locked === true) {
        newIs.get(step).locked = false;
        setIs(newIs);
        if (on && on.unlock) {
          on.unlock(step);
        }
      }
    },
  };

  const Component = () => {
    return (
      steps.size === is.size && (
        <section className="grid grid-cols-1 gap-4">
          {[...steps.keys()].map((key, index) => (
            <div
              key={hashCode(key)}
              className="flex flex-row border-0 border-t-[1px] border-solid border-t-[#b3b3b3] pt-5"
            >
              <div className="basis-[40px]">
                {is.get(key).checked ? (
                  <OsdsIcon
                    size={ODS_ICON_SIZE.sm}
                    name={ODS_ICON_NAME.CHECK}
                    className={'mr-2'}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                ) : (
                  <div
                    className={clsx(
                      'flex justify-center items-center font-bold border-2 border-solid rounded-full h-10 w-10',
                      is.get(key).open
                        ? 'border-[#0050d7] text-[#0050d7]'
                        : 'border-[grey] text-[grey]',
                    )}
                  >
                    {steps.get(key).order || index}
                  </div>
                )}
              </div>
              <div className="basis-full px-5">
                <div>
                  {(() => {
                    const title = steps.get(key).title;
                    return typeof title === 'function'
                      ? title({ stepIs: is.get(key), stepperIs: is, act })
                      : title;
                  })()}
                </div>
                {is.get(key).open && (
                  <>
                    <div
                      data-testid="content"
                      className={clsx(
                        'mt-5',
                        is.get(key).locked &&
                          'cursor-not-allowed pointer-events-none opacity-50',
                      )}
                    >
                      {(() => {
                        const content = steps.get(key).content;
                        return typeof content === 'function'
                          ? content({ stepIs: is.get(key), stepperIs: is, act })
                          : content;
                      })()}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </section>
      )
    );
  };

  return {
    act,
    is,
    Component,
  };
};
