import { useEffect, useState, useCallback } from "react";
import {userTotal,publishedVideoList,generatedVideoList,userPublishedList} from '@/api/homeDisplay/'
import {TableConfig} from '@/config'

export const useGetDisplayData = ()=>{

    const _titleType ={
        '用户充值金额':(options)=> userTotal( options),
        '总生成视频数':(options)=> generatedVideoList(options),
        '今日用户发布视频数':(options)=> userPublishedList(options),
        '今日商家发布视频数':(options)=> publishedVideoList(options),
    }
    const _tableTitleType ={
        '用户充值金额':TableConfig.user_total,
        '总生成视频数':TableConfig.generated_video,
        '今日用户发布视频数': TableConfig.user_published,
        '今日商家发布视频数':TableConfig.published_video,
    }
    const _titleFactory = (title)=>{
        return _titleType[title] || (()=>{
            console.log('没有合适的title')
        })
    }
    const getData= async(title,options)=>{
        const fn = _titleFactory(title)
        const {code,data,msg} = await fn(options)
        if (code === 200) {
            return data;
        } else {
            throw new Error(msg);
        }
    }
    const geTableTitle = (title)=>{
        return _tableTitleType[title] || []
    }
    return {
        getData,
        geTableTitle
    }
}