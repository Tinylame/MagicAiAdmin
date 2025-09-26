import {useEffect,useState} from 'react';
import {enterpriseVerify} from '@/api'
import { TableConfig } from '@/config'

function Certification(props) {
    const {certificateTable}=TableConfig
    const {enterpriseList,enterpriseAudit} = enterpriseVerify;
    const [requestdata, setRequestdata] = useState(
        {
            pageIndex: 1,
            pageSize: 10,
        })
    const getEnterprise = async (dats) => {
        const res =await enterpriseList(dats);
        console.log(res)
    }
    useEffect(()=>{
        getEnterprise(requestdata)
    },[requestdata])
    return (
        <div></div>
    );
}

export default Certification;