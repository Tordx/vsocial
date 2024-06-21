export interface sales {

    staffId: string,
    transId: number,
    noitem: number,
    date: Date,
    total: number,
    branch: string,
    docId: string,
    discount: number,
    subtotal: string,
}

export interface salesdetails {
    
    transId: number,
    itemno: string,
    unit: number,
    itemname: string,
    docId: string,
    unitprice: number,
}

export interface login {

    username: string,
    password: string
}

export interface userdetails {

    _userdata: any,
    email: string,
    username: string,
    active: boolean,
    status: string,
    photoURL: string,
    id: string,
    fullname: {firstname: string, middlename: string, lastname: string},
    lastloggedIn: string,
}

export interface appcontrol {
    status: boolean,
}

export interface friendlistdata {

    AccountFrom: string,
    AccountTo: string,
    friendshipid: string,

}

export interface postlist {
    postid: string,
    photo: string,
    id: string,
    description: string,
    timestamp: any,

}

export interface plannerlist {
    id: string,
    planid: string,
    description: string,
    photo: string,
    timestamp: any,
    when: string,
    title: string,
    importance: string,
    active: boolean,
    success: boolean,
    
}

export interface CombinedData {

    postData: postlist,
    userData: userdetails,

}

export interface CombinedPlannerData {
    userData: userdetails,
    planData: plannerlist,

}