/**
 * Created by Shaiful Islam on 2022-10-25.
 */
systemLoadPage= (title,file)=>{
    document.title=title;
    $('#system_main_container').load(file);
}
