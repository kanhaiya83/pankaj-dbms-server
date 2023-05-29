import moment from 'moment'

const stringToDate=(str)=>{
    if(str.includes('/')){
        return moment(str, 'DD/MM/YYYY');
    }else if(str.includes('-')) return  moment(str, 'DD-MM-YYYY');
    else{
        str='01/01/1001';
        return moment(str, 'DD/MM/YYYY');
    }
}



export default stringToDate;