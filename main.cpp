#include <drogon/drogon.h>
#include "Handler.h"
#include "DataBase.h"


using namespace drogon;
using namespace std;

DataBase db;

uint16_t port = 8000;
string server = "http://localhost:5173";


int main(int argc, char* argv[]) {
    for(int i = 1; i< argc; i++){
        string argument = argv[i];
        if(argument == "-s" || argument == "-server"){
            if(i + 1 < argc){
                server = argv[++i];
            }
        }else if(argument == "-p" || argument == "-port"){
            if(i + 1 < argc){
                try{
                    int buffer_port = stoi(argv[++i]);
                    if(buffer_port > 0 && buffer_port <= 65535){
                        port = static_cast<uint16_t>(buffer_port);
                    }else{
                        cout<<"Invalid port number. Using default"<<endl;
                    }
                }catch(...){
                    cout<<"Invalid port number. Using default"<<endl;
                }
            }
        }
    }





    app().setThreadNum(4);
    app().setDocumentRoot("../images/");
    app().setStaticFileHeaders({
        {"Cache-Control", "public, max-age=86400"},
        {"Access-Control-Allow-Origin", server},
        {"Access-Control-Allow-Credentials", "true"}
    });

    
    app().registerPreRoutingAdvice([](const drogon::HttpRequestPtr &req, drogon::FilterCallback &&defer, drogon::FilterChainCallback &&chain) {
        if (req->method() == Options) {
            auto resp = drogon::HttpResponse::newHttpResponse();
            resp->setStatusCode(k200OK);
            
            string origin = req->getHeader("Origin");
            if (origin.empty()){
                origin = server;
            }
            
            resp->addHeader("Access-Control-Allow-Origin", origin);
            resp->addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, Patch");
            resp->addHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Requested-With, Cookie");
            resp->addHeader("Access-Control-Allow-Credentials", "true");
            resp->addHeader("Access-Control-Max-Age", "3600");
            
            defer(resp);
            return;
        }
        chain();
    });
 
    app().registerHandler("/register", &Handler::RegisterUser, {Post});

    app().registerHandler("/login", &Handler::AutoriseUser, {Post});

    app().registerHandler("/cats", &Handler::GetCats, {Get});
    app().registerHandler("/cats", &Handler::uploadCatPhoto, {Post});
    app().registerHandler("/cats/{id}",&Handler::updateCat,{Put});

    app().registerHandler("/bookings",&Handler::AddToBookings,{Post});

    app().registerHandler("/profile",&Handler::GetUserData,{Get});

    app().registerHandler("/bookings/admin",&Handler::GetAdminBookings,{Get});
    app().registerHandler("/bookings/admin",&Handler::AddAdminBooking,{Post});
    app().registerHandler("/bookings/admin",&Handler::ConfirmAdminBookings,{Put});
    app().registerHandler("/bookings/admin",&Handler::RejectAdminBooking,{Delete});
    app().registerHandler("/bookings/admin",&Handler::EditAdminBooking,{Patch});

    app().registerHandler("/users",&Handler::GetUsers,{Get});

    app().registerHandler("/admin/UserCreate",&Handler::RegisterUserAdmin,{Post});



    app().registerHandler("/logout",&Handler::LogOut,{Post});

    cout<<"server is running"<<endl;

    app().addListener("0.0.0.0", port).run();

    return 0;
}