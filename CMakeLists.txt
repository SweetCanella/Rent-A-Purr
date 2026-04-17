cmake_minimum_required(VERSION 3.15)
project(SPO_1)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(NOT DEFINED CMAKE_TOOLCHAIN_FILE)
    if(DEFINED ENV{VCPKG_ROOT})
        set(CMAKE_TOOLCHAIN_FILE "$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake" CACHE STRING "")
    elseif(WIN32)
        set(CMAKE_TOOLCHAIN_FILE "C:/Users/evgen/vcpkg/scripts/buildsystems/vcpkg.cmake" CACHE STRING "")
    else()
        set(CMAKE_TOOLCHAIN_FILE "$ENV{HOME}/vcpkg/scripts/buildsystems/vcpkg.cmake" CACHE STRING "")
    endif()
endif()

if(NOT DEFINED VCPKG_TARGET_TRIPLET)
    if(WIN32)
        set(VCPKG_TARGET_TRIPLET "x64-mingw-static" CACHE STRING "")
    else()
        set(VCPKG_TARGET_TRIPLET "x64-linux" CACHE STRING "")
    endif()
endif()

find_package(Drogon CONFIG REQUIRED)
find_package(jsoncpp CONFIG REQUIRED)

add_library(SQLite3_local STATIC 
    libs/Sql/sqlite3.c
)
target_include_directories(SQLite3_local PUBLIC libs/Sql)

find_package(Threads REQUIRED)
target_link_libraries(SQLite3_local PUBLIC Threads::Threads)

add_executable(SPO_1 
    main.cpp
    DataBase.cpp
    DataBase.h
    Handler.cpp
    Handler.h
)

target_include_directories(SPO_1 PRIVATE libs/Sql)

target_link_libraries(SPO_1 
    Drogon::Drogon
    JsonCpp::JsonCpp
    SQLite3_local
)