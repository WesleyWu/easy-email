import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';
import { Stack, TextStyle, useBlock, useEditorProps } from 'easy-email-editor';
import { MergeTags } from './MergeTags';
import { BasicType, BlockManager } from 'easy-email-core';

export interface AttributesPanelWrapper {
  style?: React.CSSProperties;
  extra?: React.ReactNode;
}
export const AttributesPanelWrapper: React.FC<AttributesPanelWrapper> = (
  props
) => {
  const { focusBlock, setFocusBlock } = useBlock();
  const { mergeTags } = useEditorProps();
  const block = focusBlock && BlockManager.getBlockByType(focusBlock.type);

  const onChangeHidden = useCallback(
    (val: string | boolean) => {
      if (!focusBlock) return;
      focusBlock.data.hidden = val as any;
      setFocusBlock({ ...focusBlock });
    },
    [focusBlock, setFocusBlock]
  );

  if (!focusBlock || !block) return null;

  return (
    <>
      <div
        style={{
          border: '1px solid #f0f0f0',
          borderBottom: 'none',
          padding: '12px 24px',
        }}
      >
        <Stack vertical>
          <Stack.Item fill>
            <Stack wrap={false} distribution='equalSpacing' alignment='center'>
              <Stack spacing='extraTight' alignment='center'>
                <EyeIcon />
                <TextStyle>{`${block.name} attributes`}</TextStyle>
              </Stack>
              <Stack.Item>{props.extra}</Stack.Item>
            </Stack>
          </Stack.Item>
          {/* <MergeTags /> */}
          {Boolean(focusBlock.data.hidden) && mergeTags && (
            <Stack spacing='extraTight'>
              <TextStyle>Hide if</TextStyle>
              <MergeTags
                isSelect
                onChange={onChangeHidden}
                value={String(focusBlock.data.hidden)}
              />
            </Stack>
          )}
        </Stack>
      </div>

      <div style={{ padding: '0px', ...props.style }}>{props.children}</div>
    </>
  );
};

function EyeIcon() {
  const { setFocusBlock, focusBlock } = useBlock();

  const onToggleVisible = useCallback(
    (e: React.MouseEvent) => {
      if (!focusBlock) return null;
      e.stopPropagation();
      setFocusBlock({
        ...focusBlock,
        data: {
          ...focusBlock.data,
          hidden: !focusBlock.data.hidden,
        },
      });
    },
    [focusBlock, setFocusBlock]
  );

  if (!focusBlock) return null;

  if (focusBlock.type === BasicType.PAGE) return null;

  return focusBlock.data.hidden ? (
    <EyeInvisibleOutlined onClick={onToggleVisible} />
  ) : (
    <EyeOutlined onClick={onToggleVisible} />
  );
}