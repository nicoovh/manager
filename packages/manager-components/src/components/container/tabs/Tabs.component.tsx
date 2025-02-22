import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import { clsx } from 'clsx';
import { v4 as uuidV4 } from 'uuid';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { hashCode } from '../../../utils';

type TProps<Item> = {
  id?: string;
  items?: Item[];
  titleElement?: (item: Item) => JSX.Element | string;
  contentElement?: (item: Item) => JSX.Element;
  mobileBreakPoint?: number;
  className?: string;
  onChange?: (item: Item) => void;
};

type TState<Item> = {
  items: Item[];
  selectedItem?: Item;
};

export const TabsComponent = function TabsComponent<Item>({
  id = uuidV4(),
  items = [],
  titleElement = (item) => <div>{`title ${item}`}</div>,
  contentElement = (item) => <div>{`content ${item}`}</div>,
  mobileBreakPoint,
  className,
  onChange,
}: TProps<Item>): JSX.Element {
  const [state, setState] = useState<TState<Item>>({
    items,
    selectedItem: undefined,
  });

  const setSelectedItem = (item: Item): void => {
    setState((prev) => ({
      ...prev,
      selectedItem: item,
    }));
  };

  useEffect(() => {
    if (
      Array.isArray(items) &&
      items.length &&
      (items.length !== state.items.length ||
        items.some((item, index) => !Object.is(item, state.items[index])))
    ) {
      setState(() => ({
        items,
        selectedItem: items[0],
      }));
    }
  }, [items]);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(state.selectedItem);
    }
  }, [state.selectedItem]);

  const isDesktop = useMedia(`(min-width: ${mobileBreakPoint || 760}px)`);

  return (
    <>
      {isDesktop ? (
        <section
          className={clsx('rounded-sm', className)}
          data-testid="desktop"
        >
          <ul
            className="flex flex-row list-none p-0 m-0 w-full"
            data-testid="titles"
          >
            {state.items.map((item) => (
              <li
                key={`tabs-${id}title-${hashCode(item)}`}
                className={clsx(
                  'px-4 py-4 cursor-pointer border border-solid border-[#bef1ff] rounded-t-lg',
                  item === state.selectedItem
                    ? 'border-b-0 bg-[#F5FEFF]'
                    : 'border-b bg-white',
                )}
              >
                <button
                  className="border-0 bg-transparent cursor-pointer w-full"
                  onClick={() => setSelectedItem(item)}
                  onKeyDown={() => setSelectedItem(item)}
                >
                  {titleElement(item)}
                </button>
              </li>
            ))}
            <li
              key={'none'}
              className="border-0 border-b border-solid border-b-[#bef1ff] w-full"
            ></li>
          </ul>
          <div className="bg-[#F5FEFF] border border-solid border-[#bef1ff] border-t-0">
            {contentElement(state.selectedItem)}
          </div>
        </section>
      ) : (
        <section
          className={clsx('grid gap-6 grid-cols-1', className)}
          data-testid="mobile"
        >
          {state.items.map((item) => (
            <div
              key={`tabs-${id}title-${hashCode(item)}`}
              className="px-2 bg-[#F5FEFF] border border-solid border-[#bef1ff] rounded-lg"
            >
              <button
                className="flex cursor-pointer px-4 py-4 w-full border-0 bg-transparent"
                onClick={() => setSelectedItem(item)}
                onKeyDown={() => setSelectedItem(item)}
              >
                <div className="w-full">{titleElement(item)}</div>
                <div className="w-fit flex items-center">
                  {!Object.is(state.selectedItem, item) ? (
                    <OsdsIcon
                      className=""
                      name={ODS_ICON_NAME.CHEVRON_DOWN}
                      size={ODS_ICON_SIZE.sm}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    ></OsdsIcon>
                  ) : (
                    <OsdsIcon
                      className=""
                      name={ODS_ICON_NAME.CHEVRON_UP}
                      size={ODS_ICON_SIZE.sm}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    ></OsdsIcon>
                  )}
                </div>
              </button>
              {Object.is(state.selectedItem, item) && (
                <div>{contentElement(item)}</div>
              )}
            </div>
          ))}
        </section>
      )}
    </>
  );
};

export default TabsComponent;
