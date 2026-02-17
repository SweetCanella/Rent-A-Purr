#include <drogon/drogon.h>
#include "Handler.h"
#include "DataBase.h"

using namespace drogon;
using namespace std;

DataBase db;





int main() {
    app().registerHandler("/register", &Handler::RegisterUser, {Post});

    app().registerHandler("/login", &Handler::AutoriseUser, {Get});

    app().addListener("0.0.0.0", 3000).run();
    return 0;
}