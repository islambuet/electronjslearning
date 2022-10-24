/**
 * Created by Shaiful Islam on 2022-10-25.
 */
systemLoadCurrentPage=()=>{
    if(systemPages[systemCurrentPage]){
        let page=systemPages[systemCurrentPage];
        systemLoadPage(page.title,page.file)
    }

}
systemLoadPage= (title,file)=>{
    document.title=title;
    //$('#system_main_container').load(file);
}
