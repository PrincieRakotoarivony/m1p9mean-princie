
$(document).ready(function (){
    var sidebarOpened = true;
    function closeSidebar(){
        document.getElementById('sidebar').style.left = "-200px";
        sidebarOpened = false;
    }

    function setSidebarOpened(){
        if(window.screen.width < 1000){
            closeSidebar();
        }
    }

    window.addEventListener('resize', () => {setSidebarOpened();});
    document.getElementById('menu-close').addEventListener('click', function (){
        closeSidebar();
    });

    document.getElementById('menu-bars').addEventListener('click', function(){
        document.getElementById('sidebar').style.left = sidebarOpened ? "-200px":"0";
        sidebarOpened = !sidebarOpened;
    });
    
    setSidebarOpened();
});



