import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

const searchRestaurant = async (req: Request, res: Response) => {
    try {
      const city = req.params.city;
  
      const searchQuery = (req.query.searchQuery as string) || "";
      const selectedCuisines = (req.query.selectedCuisines as string) || "";
      const sortOption = (req.query.sortOption as string) || "lastUpdated";
      const page = parseInt(req.query.page as string) || 1;
  
      let query: any = {};
  
      query["city"] = new RegExp(city, "i");
      const cityCheck = await Restaurant.countDocuments(query);
      if (cityCheck === 0) {
        return res.status(404).json({   data: [],
            pagination: {
              total: 0,
              page: 1,
              pages: 1,
            },
        });
      }
  
      if (selectedCuisines) {
        const cuisinesArray = selectedCuisines
          .split(",")
          .map((cuisine) => new RegExp(cuisine, "i"));
  
        query["cuisines"] = { $all: cuisinesArray };
      }
  
      if (searchQuery) {
        const searchRegex = new RegExp(searchQuery, "i"); //i=ignore case
        query["$or"] = [
          { restaurantName: searchRegex },
          { cuisines: { $in: [searchRegex] } }, //$in = any match in the entire cuisines array
        ];
      }
  
      const pageSize = 10;
      const skip = (page - 1) * pageSize; //how many records to skip
  
      // sortOption = "lastUpdated"
      const restaurants = await Restaurant.find(query)
        .sort({ [sortOption]: 1 })
        .skip(skip) //not all the results,skip as per need
        .limit(pageSize) //10 here
        .lean(); //stripes all mongoose data and returns only plain old js object
  
      const total = await Restaurant.countDocuments(query); //used to determine how many total pages for particular query
  
      const response = {
        data: restaurants,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / pageSize),// 30 results and page sze = 10 then 3 pages
        },
      };
  
      res.json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  export default {
    searchRestaurant,
  };