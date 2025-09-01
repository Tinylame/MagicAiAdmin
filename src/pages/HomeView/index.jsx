import homeStyle from './index.module.scss'
import Menus from '@/components/Menus'
import Main from '@/components/Main'
import Title from "@components/Title/index.jsx";
import { useSelector } from 'react-redux';

export default function Home() {
    const isTitle = useSelector((state) => state.title.isTitle);
    return (
        <div className={homeStyle.Home}>
            <div className={homeStyle.Menu} style={{width:isTitle ? '80px' : '260px',minWidth:isTitle?'80px' : '260px'}}>
                <Menus/>
            </div>
            <div className={homeStyle.Content} >
                <div className={homeStyle.Title}>
                    <Title/>
                </div>
                <div className={homeStyle.Main}>
                    <Main/> 
                </div>
            </div>
        </div>
    )
}
