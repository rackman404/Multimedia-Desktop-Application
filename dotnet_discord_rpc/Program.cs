

using System.Text;

public struct RPCData
{
    public string details { get; private set; }
    public string state { get; private set; }
    public int endTimestamp { get; private set; }
    public int startTimestamp { get; private set; }
    public string LargeImageURL { get; private set; }
    public RPCData(string d, string s, int ets, int sts, string lIURL)
    {
        this.details = d;
        this.state = s;
        this.startTimestamp = sts;
        this.endTimestamp = ets;
        this.LargeImageURL = lIURL;
    }

}


class Program
{
    static void Main(string[] args)
    {

        DiscordController clientController = new DiscordController();

        string updates = "";

        Task.Run(() =>
        {
            do
            {
                System.Threading.Thread.Sleep(200);
                string? temp = Console.ReadLine();
                if (temp != null)
                {
                    updates = temp;
                }
            }
            while (true);
        });


        

        Console.WriteLine("Starting Discord Rich Presence Client");

        while (true)
        {

            clientController.UpdateMethod();
            System.Threading.Thread.Sleep(200);

            if (updates != "" && updates != null)
            {
                try
                {
                    Console.WriteLine("recieved data (RPC client): " + updates);
                    RPCData data = ParseData(updates);
                    clientController.UpdateRichPresence(data);
                }
                catch (Exception e)
                {
                    Console.WriteLine("catastrophic failure:" + updates + " " + e);
                    updates = "";
                }


                updates = "";
            }
        }
    }
    
    public static RPCData ParseData(string updateMsg)
    {
        string[] parsed = updateMsg.Split(",");

        return new RPCData(parsed[0], parsed[1], Int32.Parse(parsed[2]), Int32.Parse(parsed[3]), parsed[4]);
    }


    /* For forseeable future, only current song data should be streamed to CLI, formatted as the following:
    - Song name
    - Artist Name
    - Start timestamp (seconds)
    - End timestamp (seconds)
    - Large Image URL
    */


}


public class DiscordController
{
    long CLIENT_ID = 1387954440316784750;

    public Discord.Discord discord;

    public Discord.ActivityManager activityManager;

    // Use this for initialization
    public DiscordController()
    {
        Console.WriteLine("Initializing Controller");

        discord = new Discord.Discord(CLIENT_ID, (System.UInt64)Discord.CreateFlags.NoRequireDiscord);
        activityManager = discord.GetActivityManager();

        Discord.ActivityAssets tempAssets = new Discord.ActivityAssets();
        tempAssets.LargeImage = "https://www.iconsdb.com/icons/preview/gray/note-xxl.png";

        Discord.ActivityTimestamps timestamps = new Discord.ActivityTimestamps();
        timestamps.Start = 0;
        //timestamps.End = 1032042665;

        var activity = new Discord.Activity
        {
            State = "ロストア.",
            Details = "Idling",
            Assets = tempAssets,
            Timestamps = timestamps,
        };

        activityManager.UpdateActivity(activity, (res) =>
        {
            if (res == Discord.Result.Ok)
            {
                Console.WriteLine("Activity Updated!");
            }
        });
    }

    public void UpdateRichPresence(RPCData data)
    {
        Discord.ActivityAssets tempAssets = new Discord.ActivityAssets();

        tempAssets.LargeImage = data.LargeImageURL;

        Discord.ActivityTimestamps timestamps = new Discord.ActivityTimestamps();
        timestamps.Start = data.startTimestamp;
        //timestamps.End = data.endTimestamp;

        Console.WriteLine("ロストア");

        var activity = new Discord.Activity
        {
            //https://github.com/discord/discord-rpc/issues/119
            State = Encoding.UTF8.GetString(Encoding.UTF8.GetBytes(data.state)),
            Details = Encoding.UTF8.GetString(Encoding.UTF8.GetBytes(data.details)),
            Assets = tempAssets,
            Timestamps = timestamps,
        };

        activityManager.UpdateActivity(activity, (res) =>
        {
            if (res == Discord.Result.Ok)
            {
                //Console.WriteLine("Updated State");
            }
        });
    }
 
    // Update is called once per frame
    public void UpdateMethod()
    {
        discord.RunCallbacks();
    }
}


