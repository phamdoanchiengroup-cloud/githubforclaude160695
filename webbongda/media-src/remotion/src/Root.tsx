import React from 'react';
import {Composition} from 'remotion';
import {Main, TOTAL} from './Video';
import {Fifa, FIFA_TOTAL} from './Fifa';
import {RhinoAd, RHINO_TOTAL} from './RhinoAd';
import {R2BF, R2HL, R2_TOTAL} from './R2Ad';
import {PhaGiaBF, PhaGiaHL, PG_TOTAL} from './PhaGia';
import {Film, FILM_TOTAL, FilmNgan, FILM_NGAN_TOTAL} from './Film';
import {Future, FUT_TOTAL, San3DDemo, SAN3D_TOTAL} from './Future';
import {GiaiFuture, GIAI_TOTAL} from './Giai';
import {NhaMay, NM_TOTAL} from './NhaMay';
import {GioiThieu, GT_TOTAL} from './GioiThieu';
import {Hype, HYPE_TOTAL} from './Hype';
import {HypeLuot2, HYPE2_TOTAL} from './HypeLuot2';
import {HypeLuot2PS, HYPE2PS_TOTAL} from './HypeLuot2PS';
import {Poster} from './Poster';
import {PosterLuot2, PosterLuot2Doc} from './PosterLuot2';
import {PosterGiai} from './PosterGiai';
import {PosterFuture} from './PosterFuture';
import {PosterChuoi, PosterThuongHieu, PosterDoiDau, PosterDoiDauDoc} from './PosterDemo';
import {KetQua, KQ_TOTAL, KetQuaDoc, KQ_DOC_TOTAL} from './KetQua';
import {Halloween, HL_TOTAL, BlackFriday, BF_TOTAL} from './Seasonal';
export const RemotionRoot: React.FC = () => (<>
  <Composition id="Main" component={Main} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="Fifa" component={Fifa} durationInFrames={FIFA_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="RhinoAd" component={RhinoAd} durationInFrames={RHINO_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="Halloween169" component={Halloween} durationInFrames={HL_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="Halloween916" component={Halloween} durationInFrames={HL_TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="BlackFriday169" component={BlackFriday} durationInFrames={BF_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="BlackFriday916" component={BlackFriday} durationInFrames={BF_TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="Retro2BF" component={R2BF} durationInFrames={R2_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="Retro2HL" component={R2HL} durationInFrames={R2_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="PhaGiaBF" component={PhaGiaBF} durationInFrames={PG_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="PhaGiaHL" component={PhaGiaHL} durationInFrames={PG_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="Film" component={Film} durationInFrames={FILM_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="FilmNgan" component={FilmNgan} durationInFrames={FILM_NGAN_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="Future" component={Future} durationInFrames={FUT_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="San3DDemo" component={San3DDemo} durationInFrames={SAN3D_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="GiaiFuture" component={GiaiFuture} durationInFrames={GIAI_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="NhaMay" component={NhaMay} durationInFrames={NM_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="KetQua" component={KetQua} durationInFrames={KQ_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="KetQuaDoc" component={KetQuaDoc} durationInFrames={KQ_DOC_TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="GioiThieu" component={GioiThieu} durationInFrames={GT_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="GioiThieuDoc" component={GioiThieu} durationInFrames={GT_TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="HypeLuot2PS" component={HypeLuot2PS} durationInFrames={HYPE2PS_TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="HypeLuot2Doc" component={HypeLuot2} durationInFrames={HYPE2_TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="HypeDoc" component={Hype} durationInFrames={HYPE_TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="PosterLuot2" component={PosterLuot2} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="PosterLuot2Doc" component={PosterLuot2Doc} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Poster2310" component={Poster} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="PosterGiai" component={PosterGiai} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="PosterChuoi" component={PosterChuoi} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="PosterThuongHieu" component={PosterThuongHieu} durationInFrames={1} fps={30} width={1080} height={1350} />
  <Composition id="PosterFuture" component={PosterFuture} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="PosterDoiDau" component={PosterDoiDau} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="PosterDoiDauDoc" component={PosterDoiDauDoc} durationInFrames={1} fps={30} width={1080} height={1920} />
</>);
