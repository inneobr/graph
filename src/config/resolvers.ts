import { YouTubeService } from '@/services/youtube';
import { GoogleService } from '@/services/google';
import { getConnection } from '@/config/source';
interface Args { cidadeId: number }
import oracledb from 'oracledb';

export const resolvers = {
    Query: {
      today: async (_parent: unknown, args: Args) => {
        const { cidadeId } = args;
        const conn = await getConnection();
  
        const result = await conn.execute(
          `SELECT * FROM TODAY
           WHERE CIDADE = :cidadeId
           ORDER BY "DATE" DESC`,
          { cidadeId },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
  
        await conn.close();
        return result.rows;
      },
  
      meteored: async (_parent: unknown, args: Args) => {
        const hoje = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
        const { cidadeId } = args;
        const conn = await getConnection();
  
        const result = await conn.execute(
          `SELECT * FROM METEORED
           WHERE "DATE" >= :hoje
             AND CIDADE = :cidadeId
           ORDER BY "DATE" ASC`,
          { hoje, cidadeId },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
  
        await conn.close();
        return result.rows;
      },
  
      nexthour: async (_parent: unknown, args: Args) => {
        const hoje = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
        const hora = new Date().toTimeString().slice(0, 5);  // 'HH:mm'
        const { cidadeId } = args;
        const conn = await getConnection();
  
        const result = await conn.execute(
          `SELECT * FROM NEXTHOUR
           WHERE CIDADE = :cidadeId
             AND (
               ("DATE" = :hoje AND "HOUR" >= :hora)
               OR ("DATE" > :hoje)
             )
           ORDER BY "DATE" ASC, "HOUR" ASC`,
          { cidadeId, hoje, hora },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
  
        await conn.close();
        return result.rows;
      },
  
      google: async (_parent: unknown, args: { query: string }) => {
        try {
          const results = await GoogleService(args.query);
          return results;
        } catch (error) {
          console.error("GoogleService:", error);
          return [];
        }
      },
  
      youtube: async (_parent: unknown, args: { query: string }) => {
        try {
          const results = await YouTubeService(args.query);
          return results;
        } catch (error) {
          console.error("GoogleService:", error);
          return [];
        }
      }
    },
  };