
'use client';

import { Zap } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";

const SubButton = ({isPro = false}: {isPro: boolean}) => {

    const [loading, setLoading] = useState(false);

    const onClick = async() => {
        try {
            setLoading(true);
            const res = await axios.get('/api/stripe');
            window.location.href = res.data.url;
            
        } catch (error) {
            console.log(error);  
        } finally{
            setLoading(false)
        }
    }
    return ( 
        <Button className="m-4" onClick={onClick} disabled={loading} variant={isPro ? "default" : "premium"}>
            {isPro ? "Manage Subscription" : "upgrade"}
            {
                !isPro && (
                    <Zap  className="w-4 h-4 ml-2 fill-white"/>
                )
            }
        </Button>
     );
}
 
export default SubButton;