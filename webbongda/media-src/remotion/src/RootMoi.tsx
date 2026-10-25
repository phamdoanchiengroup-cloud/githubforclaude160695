import React from 'react';
import {Composition} from 'remotion';
import {KetQuaLuot1Moi, KQ1_TOTAL, GioiThieuLuot2Moi, GT2_TOTAL} from './VideoMoi';
export const RootMoi: React.FC = () => (<>
  <Composition id="KetQuaLuot1Moi" component={KetQuaLuot1Moi} durationInFrames={KQ1_TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="GioiThieuLuot2Moi" component={GioiThieuLuot2Moi} durationInFrames={GT2_TOTAL} fps={30} width={1080} height={1920} />
</>);
