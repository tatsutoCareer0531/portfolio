name := """KakeiBoo"""
organization := "com.kakeiboo"
version := "1.0-SNAPSHOT"
scalaVersion := "2.12.8"
libraryDependencies += guice

//Ebeanを追加
lazy val root = (project in file(".")).enablePlugins(PlayJava, PlayEbean)

//MySQL
libraryDependencies += "mysql" % "mysql-connector-java" % "8.0.20"
libraryDependencies += evolutions
libraryDependencies += javaJdbc
