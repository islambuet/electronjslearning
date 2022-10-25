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
    $('#system-content').load(file);
    $('#system-menus .nav .nav-link').removeClass('active').addClass('bg-light');
    $('#system-menus .nav .nav-link[data-page="'+name+'"]').addClass('active').removeClass('bg-light');
    //$('#system-menus .nav .nav-link[data-page="'+name+'"]').removeClass('bg-light');
}
