class Apifeatures{
    constructor(public query:any,private queryStr:any){
        this.query=query;
        this.queryStr=queryStr;
    }

    filter(){
        let queryString=JSON.stringify(this.queryStr);
        queryString=queryString.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
        const queryObj=JSON.parse(queryString);

        //Adding serach functionality
        if(this.queryStr.search){
            const searchPattern=new RegExp(this.queryStr.search,'i');

            queryObj.$or=[{name:{$regex:searchPattern}}];
            delete queryObj.search;//Remove the search field from the original query
        }

        this.query=this.query.find(queryObj);

        return this;
    }

    sort(){
        if(this.queryStr.sort){
                const sortBy=this.queryStr.sort.split(" , ").join(" ");

                  // Split the sorting criteria by space to get the field and direction
                   const field = sortBy;
                   const direction='desc';
                   // Create a dynamic sorting object
                   const sortObj: { [key: string]: number } = {};
                   sortObj[field] = direction === 'desc' ? -1 : 1;
                this.query=this.query.sort(sortObj);
        }else{
            this.query=this.query.sort('-createdAt');
        }   
        return this;
    }

    limitFields(){
        if(this.queryStr.fields){
            const fileds=this.queryStr.fields;
            this.query=this.query.select(fileds);
        }else{
            this.query=this.query.select('-__v');
        }
        return this;
    }

    paginate(){
        const page=this.queryStr.page*1||1;
        const limit=this.queryStr.limit*1||10;
        const skip=(page-1)*limit;
        this.query=this.query.skip(skip).limit(limit);
        return this;
    }
}

export = Apifeatures;