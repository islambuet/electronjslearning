/**
 * Created by Shaiful Islam on 2022-10-25.
 */
systemLoadCurrentPage=()=>{
    if(systemPages[systemCurrentPage]){
        let page=systemPages[systemCurrentPage];
        systemLoadPage(systemCurrentPage,page.title,page.file)
    }

}
systemLoadPage= (name,title,file)=>{
    document.title=title;
    $('#system_content').load(file);
}
