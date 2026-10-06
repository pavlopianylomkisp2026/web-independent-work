import { ImageResponse } from 'next/og';
export const alt = 'StudyHub — learn, explore, create';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{display:'flex',width:'100%',height:'100%',background:'#f7f7f2',padding:80,flexDirection:'column',justifyContent:'space-between',color:'#235b46'}}><div style={{fontSize:44,display:'flex'}}>studyhub.</div><div style={{fontSize:88,lineHeight:1.1,display:'flex',flexDirection:'column'}}><span>Learn. Explore.</span><span>Create.</span></div><div style={{display:'flex',fontSize:28,color:'#63716a'}}>Web development, step by step.</div></div>,size);
}
