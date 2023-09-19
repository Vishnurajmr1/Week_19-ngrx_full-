class Apifeatures{
    constructor(private query:any,private queryStr:any){
        this.query=query;
        this.queryStr=queryStr;
    }

    filter(){
        let queryString=JSON.stringify(this.queryStr);
        queryString=queryString.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
        const queryObj=JSON.parse(queryString);

        //Adding serach functionality
        if(this.queryStr.search){
            queryObj.$text={$search:this.queryStr.search};
            delete queryObj.search;//Remove the search field from the original query
        }

        this.query=this.query.find(queryObj);

        return this;
    }

    sort(){
        if(this.query.sort){
            const sortBy=this.queryStr.sort.split(',').join(' ');
            this.query=this.query.sort(sortBy);
        }else{
            this.query=this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields(){
        
    }


}