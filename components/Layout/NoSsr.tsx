import dynamic from 'next/dynamic';
import React from 'react';

import { ReactNode } from 'react';

interface PropsParams {
  locale:string
}
 interface Props  {
  children: ReactNode
  params: Partial<PropsParams>
}
const NoSSR = (props: Partial<Props>) => <React.Fragment>{props.children}</React.Fragment>;

export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
});