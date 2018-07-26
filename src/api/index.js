import request from 'superagent';

const URL = 'http://112.74.16.243:8989/province-api-v5/';

export function getEpg({code, appVersion}) {
    return request.post(`${URL}epg/get`).send({code, appVersion});
}

export function getProgram({id, current, pageSize}) {
    return request.post(`${URL}program/get`).send({id, current, pageSize});
}

export function getVideoList({seriesCode, appVersion, platform, format, pageSize, pageable}) {
    return request.post(`${URL}video/list`).send({seriesCode, appVersion, platform, format, pageSize, pageable});    
}