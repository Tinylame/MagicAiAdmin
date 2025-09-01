import { Pagination } from 'antd';

const MagicPagination =({total,defaultCurrent=1,defaultPageSize,onChange})=>{
    const handleChange = (page,pageSize) => {
        if(onChange) {
            onChange(page,pageSize)
        }
    }
    return (
        <div>
            <Pagination total={total} defaultCurrent={defaultCurrent} defaultPageSize={defaultPageSize} onChange={handleChange}/>
        </div>
    )
}
export default MagicPagination